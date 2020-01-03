import * as React from "react";

import {
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    makeStyles,
    TextField,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import ServiceProvider from "../services/service-provider";

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
        nameEntry: {
            margin: theme.spacing(2),
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

    const [file, setFile] = React.useState<File | null>(null);
    const [filename, setFilename] = React.useState<string>("");

    const selectImage = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const files = ev.target.files;
        if (files == null || files.length === 0) {
            return;
        }

        setFile(files[0]);
        setFilename(files[0].name);
    };
    const onNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => setFilename(ev.target.value);

    const handleUpload = async () => {
        if (file == null || filename.length === 0) {
            return;
        }

        const extIx = file.name.lastIndexOf(".");
        const extension = file.name.slice(extIx);  // Includes "."
        const finalName = filename.endsWith(extension) ? filename : filename + extension;

        const image = ServiceProvider.ImageService();
        await image.putImage(finalName, file);
        props.onDone(finalName);
        props.onRequestClose();
    };

    const details = file == null ? null : (
        <>
            <TextField label="Name" className={classes.nameEntry} value={filename} onChange={onNameChange} />
            <div className={classes.imagePreview}>
                <img src={URL.createObjectURL(file)} />
            </div>
        </>
    );

    const disableUpload = file == null || filename.length === 0;

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
                    <Button variant="contained" component="label">
                        Select File
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={selectImage} />
                    </Button>
                    {details}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onRequestClose}>Cancel</Button>
                    <Button onClick={handleUpload} disabled={disableUpload}>Upload</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
