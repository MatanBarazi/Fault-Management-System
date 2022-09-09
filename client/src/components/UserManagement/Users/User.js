import React from "react";
import {
  Card,
  Typography,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
// import DeleteIcon from "@material-ui/icons/Delete";
// import { deleteuser } from "../../../actions/users";

// import { useDispatch } from "react-redux";
import useStyles from "./styles";
import EditUserModal from "./User/EditUserModel";
import DeleteUserModal from "./User/DeleteUserModal";

const User = ({ user,updateUsers }) => {
  const classes = useStyles();
  // const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card
      variant="outlined"
      className={classes.card}
      style={{ display: "inline-block" }}
    >
      <CardMedia align="center">
        {user.gender === "female" ? (
          <img
            src="https://img.icons8.com/ios-filled/100/000000/user-female-circle.png"
            alt=""
          />
        ) : (
          <img
            src="https://img.icons8.com/ios-filled/100/000000/user-male-circle.png"
            alt=""
          />
        )}
        
      </CardMedia>
      <CardContent className={classes.cardContent}>
        {[
          {
            label: "Full Name",
            field: `${user.name} ${user.surname}`,
          },
          {
            label: "Team",
            field: `${user.team}`,
          },
          {
            label: "Email",
            field: `${user.email}`,
          },

          // {
          //   label: "Gender",
          //   field: user.gender,
          // },
          // {
          //   label: "Age",
          //   field: user.age,
          // },
          // {
          //   label: "Language",
          //   field: user.language,
          // },
          // {
          //   label: "Surgerys",
          //   field: user.surgerys,
          // },
        ].map((item) => (
          <Typography
            className={classes.text}
            color="textSecondary"
            variant="h6"
            align="center"
            key={item.field}
          >
            <strong>{item.label}</strong>: {item.field}
          </Typography>
        ))}

        
        
      </CardContent>
      <CardActions className={classes.cardActions}>
        {/* <Button size="small" color="primary" onClick={handleClickOpen}>
           <DeleteIcon fontSize="small" /> Delete 
        </Button> */}
        <EditUserModal user={user} updateUsers={updateUsers}/>
        <DeleteUserModal _id={user._id} updateUsers={updateUsers}/>
      </CardActions>
      {/* <Dialog open={open} onClose={handleClose}>
        <DialogTitle className={classes.dialogTitle} id="alert-dialog-title">
          {"Are you sure you want to delete this user?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            // onClick={() => dispatch(deleteuser(user._id))}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog> */}
    </Card>
  );
};

export default User;
