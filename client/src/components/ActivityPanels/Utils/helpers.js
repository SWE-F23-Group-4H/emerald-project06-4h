import {
  createSubmission,
  getSubmission,
  saveWorkspace,
  updateActivityLevelTemplate,
  createAuthorizedWorkspace,
  updateAuthorizedWorkspace,
  updateActivityTemplate,
} from '../../../Utils/requests';
import { message } from 'antd';
//import {}

function new_lines(first_input,second_input) //first_input must be longer than second_input
      {
        let index_of_new = 0;
        let index_of_new_end = 0;
        let longest_length = 0;
        let first_is_longer = 0;
        let second_index = 0;
        if (first_input.length > second_input.length)
        {
          first_is_longer = 1;
          longest_length = first_input.length;
        }
        else
        {
          longest_length = second_input.length;
          first_is_longer = 0;
        }
        for (let i = 0 ; i<longest_length-1; i++) //determines where differences in the string start and end.
        {
            if(first_is_longer = 1)
            {
              //console.log("got here"); //for debugging
              if(first_input[i] == second_input[second_index])
              {
                second_index++;
              }
              else if (i == second_index)
              {
                index_of_new = i;
              }
              else
              {
                index_of_new_end = i;
              }
              }
            }
          let holder_array = [index_of_new,index_of_new_end];
          return holder_array;
        }

const AvrboyArduino = window.AvrgirlArduino;

export const setLocalSandbox = (workspaceRef) => {
  let workspaceDom = window.Blockly.Xml.workspaceToDom(workspaceRef);
  let workspaceText = window.Blockly.Xml.domToText(workspaceDom);
  const localActivity = JSON.parse(localStorage.getItem('sandbox-activity'));

  let lastActivity = { ...localActivity, template: workspaceText };
  localStorage.setItem('sandbox-activity', JSON.stringify(lastActivity));
};

// Generates xml from blockly canvas
export const getXml = (workspaceRef, shouldAlert = true) => {
  const { Blockly } = window;

  let xml = Blockly.Xml.workspaceToDom(workspaceRef);
  let xml_text = Blockly.Xml.domToText(xml);
  if (shouldAlert) alert(xml_text);
  return xml_text;
};

// Generates javascript code from blockly canvas
export const getJS = (workspaceRef) => {
  window.Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  let code = window.Blockly.JavaScript.workspaceToCode(workspaceRef);
  alert(code);
  return code;
};

// Generates Arduino code from blockly canvas
export const getArduino = (workspaceRef, shouldAlert = true) => {
  window.Blockly.Arduino.INFINITE_LOOP_TRAP = null;



  let previous_code = "";
  if (JSON.parse(localStorage.getItem('previous_code') != null))
    {
      console.log("old code is grabbed");
      previous_code = JSON.parse(localStorage.getItem('previous_code'));
    }
  else 
    {
    previous_code = window.Blockly.Arduino.workspaceToCode(workspaceRef);
    }
  
  let code = window.Blockly.Arduino.workspaceToCode(workspaceRef);



  code = "void customcode(){}\n" + code.replace("void setup() {","void setup() {\n  customcode();"); //directly modifies and implants
  //a call to custom function inside the arduino string of code
  //let custom_code = "pinMode(13, OUTPUT); while(1){digitalWrite(13, HIGH);delay(1000);digitalWrite(13, LOW);delay(1000);};"
  let custom_code = "pinMode(1,OUTPUT);Serial.begin(9600);while(1){Serial.write(\"h\");delay(1000);}" //code that is inserted in definition of custom code
  code = code.replace("{}","{\n" + custom_code + "\n}")
  if (shouldAlert) alert(code);



  if (previous_code == code)
  {
    //console.log("what is grabbed: ");
    //console.log(previous_code);
    //console.log("same code");
  }
  else
  {
    console.log("append here");
    //code.replace(code[code.lastIndexOf(";")],";\nnew_code();")
  }


  //console.log("what is saved:");
  //console.log(code);
  console.log(new_lines(code,previous_code));
  let start = new_lines(code,previous_code)[0];
  let end = new_lines(code,previous_code)[1];
  console.log(code.substring(start,end));
  localStorage.setItem('previous_code', JSON.stringify(code));
  return code;
};

let intervalId;
const compileFail = (setSelectedCompile, setCompileError, msg) => {
  setSelectedCompile(false);
  message.error('Compile Fail', 3);
  setCompileError(msg);
};
// Sends compiled arduino code to server and returns hex to flash board with
export const compileArduinoCode = async (
  workspaceRef,
  setSelectedCompile,
  setCompileError,
  activity,
  isStudent
) => {
  setSelectedCompile(true);
  const sketch = getArduino(workspaceRef, false);
  let workspaceDom = window.Blockly.Xml.workspaceToDom(workspaceRef);
  let workspaceText = window.Blockly.Xml.domToText(workspaceDom);
  let path;
  isStudent ? (path = '/submissions') : (path = '/sandbox/submission');
  let id = isStudent ? activity.id : undefined;

  // create an initial submission
  const initialSubmission = await createSubmission(
    id,
    workspaceText,
    sketch,
    path,
    isStudent
  );

  // if we fail to create submission
  if (!initialSubmission.data) {
    compileFail(
      setSelectedCompile,
      setCompileError,
      'Oops. Something went wrong, please check your internet connection.'
    );
    return;
  }
  // Get the submission Id and send a request to get the submission every
  // 0.25 second until the submission status equal to COMPLETE.
  intervalId = setInterval(
    () =>
      getAndFlashSubmission(
        initialSubmission.data.id,
        path,
        isStudent,
        setSelectedCompile,
        setCompileError
      ),
    250
  );

  // Set a timeout of 20 second. If the submission status fail to update to
  // COMPLETE, show error.
  setTimeout(() => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
      compileFail(
        setSelectedCompile,
        setCompileError,
        'Oops. Something went wrong, please try again.'
      );
    }
  }, 20000);
};

const getAndFlashSubmission = async (
  id,
  path,
  isStudent,
  setSelectedCompile,
  setCompileError
) => {
  // get the submission
  const response = await getSubmission(id, path, isStudent);
  // If we fail to retrive submission
  if (!response.data) {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
    compileFail(
      setSelectedCompile,
      setCompileError,
      'Oops. Something went wrong, please check your internet connection.'
    );
    return;
  }

  // if the submission is not complete, try again later
  if (response.data.status !== 'COMPLETED') {
    return;
  }

  // If the submission is ready
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = undefined;
  }
  // flash the board with the output
  await flashArduino(response, setSelectedCompile, setCompileError);
};

const flashArduino = async (response, setSelectedCompile, setCompileError) => {
  if (response.data) {
    // if we get a success status from the submission, send it to arduino
    if (response.data.success) {
      // converting base 64 to hex
      let Hex = atob(response.data.hex).toString();

      const avrgirl = new AvrboyArduino({
        board: 'uno',
        debug: true,
      });

      avrgirl.flash(Hex, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('done correctly.');
          message.success('Compile Success', 3);
          setSelectedCompile(false);
        }
      });
    }
    // else if there is error on the Arduino code, show error
    else if (response.data.stderr) {
      message.error('Compile Fail', 3);
      setSelectedCompile(false);
      setCompileError(response.data.stderr);
    }
  } else {
    message.error(response.err);
  }
};

// save current workspace
export const handleSave = async (activityId, workspaceRef, replay) => {
  let xml = window.Blockly.Xml.workspaceToDom(workspaceRef.current);
  let xml_text = window.Blockly.Xml.domToText(xml);
  return await saveWorkspace(activityId, xml_text, replay);
};

export const handleCreatorSaveActivityLevel = async (activityId, workspaceRef, blocksList) => {
  let xml = window.Blockly.Xml.workspaceToDom(workspaceRef.current);
  let xml_text = window.Blockly.Xml.domToText(xml);

  return await updateActivityLevelTemplate(activityId, xml_text, blocksList);
};

export const handleCreatorSaveActivity = async (activityId, workspaceRef) => {
  let xml = window.Blockly.Xml.workspaceToDom(workspaceRef.current);
  let xml_text = window.Blockly.Xml.domToText(xml);

  return await updateActivityTemplate(activityId, xml_text);
};

export const handleSaveAsWorkspace = async (
  name,
  description,
  workspaceRef,
  blocksList,
  classroomId
) => {
  if (!blocksList) {
    blocksList = [];
  }

  let xml = window.Blockly.Xml.workspaceToDom(workspaceRef.current);
  let xml_text = window.Blockly.Xml.domToText(xml);

  return await createAuthorizedWorkspace(
    name,
    description,
    xml_text,
    blocksList,
    classroomId
  );
};

export const handleUpdateWorkspace = async (id, workspaceRef, blocksList) => {
  if (!blocksList) {
    blocksList = [];
  }
  let xml = window.Blockly.Xml.workspaceToDom(workspaceRef.current);
  let xml_text = window.Blockly.Xml.domToText(xml);

  return await updateAuthorizedWorkspace(id, xml_text, blocksList);
};
