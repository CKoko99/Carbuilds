import { useRef } from 'react'
import classes from './Modal.module.css'
export default function Modal(props) {
    const closeRef = useRef()
    const backgroundRef = useRef()

    function backgroundClicked(e){
        if(backgroundRef.current === e.target || closeRef.current === e.target ){
          props.close()
        }
      }
    return <><div id="myModal" ref={backgroundRef} onClick={backgroundClicked} className={classes["modal"]}>
        <div  className={classes["modal-content"]}>
            <div className={classes["modal-header"]}>
                <div className={classes["modal-title"]}>{props.title}</div>
                <span onClick={props.close} ref={closeRef} class="close">&times;</span>
            </div>
            <div className={classes["modal-body"]}>
                {props.children}
            </div>
        </div>
    </div>
    </>
}