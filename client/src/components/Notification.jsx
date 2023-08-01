import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";

function Notification(props) {
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={props.switcher}
        onClose={props.close}
        autoHideDuration={3000}
        action={[
          <IconButton arial-label="Close" color="inherit" onClick={props.close}>
            x
          </IconButton>,
        ]}
      >
        <Alert onClose={props.close} severity={props.nottype}>
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Notification;
