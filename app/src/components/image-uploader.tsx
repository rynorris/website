import * as React from "react";

import { useMediaQuery, useTheme, makeStyles, Theme, createStyles, Dialog, DialogTitle, DialogContent, List, DialogActions, Button } from "@material-ui/core";

interface IStyleProps {
    fullScreen: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imagePreview: {
            "& img": {
                width: "100%",
            },
            flexGrow: 1,
            margin: theme.spacing(2),
            minHeight: 100,
        },
        imageUploaderContent: {
            alignItems: "stretch",
            display: "flex",
            flexDirection: "column",
            height: ({ fullScreen }: IStyleProps) => fullScreen ? "100%" : 500,
            padding: theme.spacing(2),
        },
        imageUploaderDialog: {
            width: "100%",
        },
    }),
);

interface IImageUploaderProps {
    open: boolean;
    onRequestClose: () => void;
    onDone: (key: string) => void;
}

export const ImageUploader: React.SFC<IImageUploaderProps> = (props) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const classes = useStyles({ fullScreen });

    const handleUpload = () => null;
    const selectImage = () => null;

    return (
        <div>
            <Dialog
                PaperProps={{ className: classes.imageUploaderDialog }}
                fullScreen={fullScreen}
                open={props.open}
                onClose={props.onRequestClose}
            >
                <DialogTitle>Choose Image</DialogTitle>
                <DialogContent className={classes.imageUploaderContent}>
                    <Button onClick={selectImage}>Choose Image</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onRequestClose}>Cancel</Button>
                    <Button onClick={handleUpload}>Upload</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
