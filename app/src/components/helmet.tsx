import * as React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { IAppState } from "../state/model";

interface IStateProps {
    title?: string;
}

type IHeaderProps = IStateProps;

const UnconnectedHeader = ({ title }: IHeaderProps) => (
    <Helmet>
        <title>{title}</title>
    </Helmet>
);

const mapStateToProps = (state: IAppState) => ({
    title: state.site != null ? state.site.title : undefined,
});

export const Header = connect(mapStateToProps)(UnconnectedHeader);
