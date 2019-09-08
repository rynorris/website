import * as React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { AppState } from "../state/model";

interface IStateProps {
    title: string;
}

type IHeaderProps = IStateProps;

const UnconnectedHeader = ({ title }: IHeaderProps) => (
    <Helmet>
        <title>{title}</title>
    </Helmet>
);

const mapStateToProps = (state: AppState) => ({
    title: state.site.title,
});

export const Header = connect(mapStateToProps)(UnconnectedHeader);
