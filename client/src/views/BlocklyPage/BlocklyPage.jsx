import { message } from "antd"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BlocklyCanvasPanel from "../../components/ActivityPanels/BlocklyCanvasPanel/BlocklyCanvasPanel"
import NavBar from "../../components/NavBar/NavBar"
import {
  getAuthorizedWorkspaceToolbox,
  getActivityToolbox,
  getActivityToolboxAll,
} from "../../Utils/requests"
import { useGlobalState } from "../../Utils/userState"
import ToggleToolbox from "./ToggleButton"

export default function BlocklyPage({ isSandbox }) {
  const [value] = useGlobalState("currUser")
  const [activity, setActivity] = useState({})
  const navigate = useNavigate()



  useEffect(() => {
    const setup = async () => {


      //set up the toolbox toggling
      var TTB = document.getElementById('TTB');

      if(TTB)
        TTB.style.marginLeft = 60 + 'px';

      //adjust all of the contents inside of the toolbox
      var a = document.getElementById(':1');
      var b = document.getElementById(':2');
      var c = document.getElementById(':3');
      var d = document.getElementById(':4');
      var e = document.getElementById(':5');
      var f = document.getElementById(':6');
      var g = document.getElementById(':7');
      var h = document.getElementById(':8');
      var i = document.getElementById(':9');
      var j = document.getElementById(':a');
      var k = document.getElementById(':b');
      var l = document.getElementById(':c');

      if(a){
        a.style.paddingRight = 70 + 'px';
      }
      if(b){
        b.style.paddingRight = 70 + 'px';
      }
      if(c){
        c.style.paddingRight = 70 + 'px';
      }
      if(d){
        d.style.paddingRight = 70 + 'px';
      }
      if(e){
        e.style.paddingRight = 70 + 'px';
      }
      if(f){
        f.style.paddingRight = 70 + 'px';
      }
      if(g){
        g.style.paddingRight = 70 + 'px';
      }
      if(h){
        h.style.paddingRight = 70 + 'px';
      }
      if(i){
        i.style.paddingRight = 70 + 'px';
      }
      if(j){
        j.style.paddingRight = 70 + 'px';
      }
      if(k){
        k.style.paddingRight = 70 + 'px';
      }
      if(l){
        l.style.paddingRight = 70 + 'px';
      }



      // if we are in sandbox mode show all toolbox
      const sandboxActivity = JSON.parse(localStorage.getItem("sandbox-activity"))
      if (isSandbox) {
        const AllToolboxRes = await getActivityToolboxAll()
        if (!sandboxActivity?.id || value.role === "Mentor") {
          if (AllToolboxRes.data) {
            let loadedActivity = {
              ...sandboxActivity,
              toolbox: AllToolboxRes.data.toolbox,
            }
            localStorage.setItem("sandbox-activity", JSON.stringify(loadedActivity))
            setActivity(loadedActivity)
          } else {
            message.error(AllToolboxRes.err)
          }
        } else if (value.role === "ContentCreator") {
          const res = await getAuthorizedWorkspaceToolbox(sandboxActivity.id)
          if (res.data) {
            let loadedActivity = { ...sandboxActivity, selectedToolbox: res.data.toolbox }
            loadedActivity = { ...loadedActivity, toolbox: AllToolboxRes.data.toolbox }

            localStorage.setItem("sandbox-activity", JSON.stringify(loadedActivity))
            setActivity(loadedActivity)
          } else {
            message.error(res.err)
          }
        }
      }
      // else show toolbox based on the activity we are viewing
      else {
        const localActivity = JSON.parse(localStorage.getItem("my-activity"))

        if (localActivity) {
          if (localActivity.toolbox) {
            setActivity(localActivity)
          } else {
            const res = await getActivityToolbox(localActivity.id)
            if (res.data) {
              let loadedActivity = { ...localActivity, toolbox: res.data.toolbox }

              localStorage.setItem("my-activity", JSON.stringify(loadedActivity))
              setActivity(loadedActivity)
            } else {
              message.error(res.err)
            }
          }
        } else {
          navigate(-1)
        }
      }
    }

    setup()
  }, [isSandbox, navigate, value.role])

  return (
    <div className="container nav-padding">
      <NavBar />
      <div className="flex flex-row">
        <BlocklyCanvasPanel id = "canvas" activity={activity} setActivity={setActivity} isSandbox={isSandbox} />
        <ToggleToolbox id="TTB"></ToggleToolbox>
      </div>
    </div>
  )
}
