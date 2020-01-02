import ServiceProvider from "../services/service-provider";
import { SetImageList } from "./actions";
import { AppDispatch, AppThunk } from "./model";

export const fetchImageList = (): AppThunk => {
    return async (dispatch: AppDispatch) => {
        const image = ServiceProvider.ImageService();
        const list = await image.listImages();
        dispatch(SetImageList(list));
    };
};
