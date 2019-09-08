import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { makeStyles } from "@material-ui/core/styles";
import { Theme, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editContainer: {
      position: "relative",
    },
    editControls: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      zIndex: 1000,
    }
  }),
);

interface IEditContainerProps {
  editable: boolean;
  onEditButtonClick: any;
  onUpButtonClick: any;
  onDownButtonClick: any;
  onDeleteButtonClick: any;
}

export const EditContainer: React.SFC<IEditContainerProps> = props => {
  const classes = useStyles();

  if (!props.children) {
    return <div></div>;
  }

  let editButton: JSX.Element = (
    <div className={classes.editControls}>
      <IconButton onClick={props.onEditButtonClick} size="small">
        <CreateIcon color="primary" />
      </IconButton>
      <IconButton onClick={props.onUpButtonClick} size="small">
        <KeyboardArrowUpIcon color="primary" />
      </IconButton>
      <IconButton onClick={props.onDownButtonClick} size="small">
        <KeyboardArrowDownIcon color="primary" />
      </IconButton>
      <IconButton onClick={props.onDeleteButtonClick} size="small">
        <DeleteIcon color="primary" />
      </IconButton>
    </div>
  );

  return (
    <div className={classes.editContainer}>
      {props.editable ? editButton : null}
      {props.children}
    </div>
  );
};
