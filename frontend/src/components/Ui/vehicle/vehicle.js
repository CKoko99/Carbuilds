import classes from "./Vehicle.module.css";

export default function Vehicle(props){
    return <>
        <div className={classes['vehicle']}>
            {props.year} {props.make} {props.model}
        </div>
    </>
}
