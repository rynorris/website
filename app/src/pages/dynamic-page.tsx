import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import CreateIcon from "@material-ui/icons/Create";
import SaveIcon from "@material-ui/icons/Save";

import { CardEditor } from "../components/card-editor";
import { DynamicCard } from "../components/dynamic-card";
import { EditContainer } from "../components/edit-container";
import { ICard, IPage, PagesService } from "../services/pages-service";
import ServiceProvider from "../services/service-provider";
import { IToastAction, Toast } from "../state/actions";
import { IAppState } from "../state/model";

interface IMatchParams {
  pageId: string;
}

interface IRouteProps extends RouteComponentProps<IMatchParams> { }

interface IStateProps {
  allowedToEdit: boolean;
}

interface IDispatchProps {
  toast: (text: string) => void;
}

type IDynamicPageProps = IRouteProps & IStateProps & IDispatchProps;

interface IDynamicPageState {
  initialPage: IPage;
  page: IPage;
  editable: boolean;
  editorOpen: boolean;
  cardToEdit: number;
}

class UnconnectedDynamicPage extends React.Component<IDynamicPageProps, IDynamicPageState> {
  constructor(props: IDynamicPageProps) {
    super(props);
    this.state = {
      cardToEdit: 0,
      editable: false,
      editorOpen: false,
      initialPage: { title: "", cards: [] },
      page: { title: "", cards: [] },
    };
  }

  public componentDidMount() {
    this.loadPage();
  }

  public componentDidUpdate(prevProps: IDynamicPageProps) {
    if (prevProps.match.params.pageId !== this.props.match.params.pageId) {
      this.loadPage();
    }
  }

  public render() {
    const wrapped: any = this.state.page.cards.map((card: ICard, ix: number) => {
      return (
        <EditContainer
          key={"card_" + ix}
          editable={this.state.editable}
          onEditButtonClick={this.editCard(ix)}
          onUpButtonClick={this.moveCard(ix, ix - 1)}
          onDownButtonClick={this.moveCard(ix, ix + 1)}
          onDeleteButtonClick={this.removeCard(ix)}
        >
          <DynamicCard card={card} />
        </EditContainer>
      );
    });

    const editButton: JSX.Element = (
      <Fab key="edit-fab" className="floating-button" size="medium" color="primary" onClick={this.editModeOn}>
        <CreateIcon />
      </Fab>
    );

    const cancelButton: JSX.Element = (
      <Fab key="cancel-fab" className="floating-button" size="medium" color="primary" onClick={this.cancelEdit}>
        <CancelIcon />
      </Fab>
    );

    const saveButton: JSX.Element = (
      <Fab key="save-fab" className="floating-button" size="medium" color="primary" onClick={this.savePage}>
        <SaveIcon />
      </Fab>
    );

    const addButton: JSX.Element = (
      <Fab
        key="add-fab"
        className="floating-button"
        size="medium"
        color="primary"
        onClick={this.addCard}
      >
        <AddIcon />
      </Fab>
    );

    const cardToEdit = this.state.page.cards[this.state.cardToEdit];
    const buttonsToShow = this.state.editable ? [addButton, cancelButton, saveButton] : [editButton];

    const cardEditor = (
      <CardEditor
        open={this.state.editorOpen}
        onRequestClose={this.handleClose}
        card={cardToEdit}
        onSave={this.saveCard(this.state.cardToEdit)}
      />
    );

    const editorControls: JSX.Element = (
      <div>
        {!this.state.editorOpen && <div className="floating-buttons">{buttonsToShow}</div>}
        {(cardToEdit !== undefined && this.state.editorOpen) && cardEditor}
      </div>
    );

    return (
      <div>
        {wrapped}
        {this.props.allowedToEdit ? editorControls : null}
      </div>
    );
  }

  private handleClose = () => this.setState({ editorOpen: false });

  private cancelEdit = () => {
    this.editModeOff();
    this.resetPage();
  }

  private loadPage = () => {
    const pageService: PagesService = ServiceProvider.PagesService();
    pageService.loadPage(this.props.match.params.pageId).then((page) =>
      this.setState({ initialPage: page, page }));
  }

  private resetPage = () => this.setState({ page: this.state.initialPage });

  private editModeOn = () => this.setState({ editable: true });

  private editModeOff = () => this.setState({ editable: false });

  private editCard = (ix: number) => () => this.setState({ cardToEdit: ix, editorOpen: true });

  private addCard = () => {
    const newCard: ICard = {
      image: "",
      text: "",
      title: "New Card",
      type: "post",
    };

    // Clone page.
    const newPage: IPage = JSON.parse(JSON.stringify(this.state.page));
    newPage.cards.splice(this.state.page.cards.length, 0, newCard);
    this.setState({ page: newPage });
  }

  private removeCard = (ix: number) => () => {
    // Clone page.
    const newPage: IPage = JSON.parse(JSON.stringify(this.state.page));
    newPage.cards.splice(ix, 1);
    this.setState({ page: newPage });
  }

  private moveCard = (fromIx: number, toIx: number) => () => {
    if (toIx < 0 || toIx >= this.state.page.cards.length) {
      return;
    }

    const newPage: IPage = JSON.parse(JSON.stringify(this.state.page));
    const card = newPage.cards.splice(fromIx, 1);
    newPage.cards.splice(toIx, 0, card[0]);
    this.setState({ page: newPage });
  }

  private saveCard = (ix: number) => (card: ICard) => {
    // Clone page.
    const newPage: IPage = JSON.parse(JSON.stringify(this.state.page));
    newPage.cards[ix] = card;
    this.setState({ page: newPage, editorOpen: false });
  }

  private savePage = () => {
    const pageService: PagesService = ServiceProvider.PagesService();
    const response: Promise<any> = pageService.savePage(this.props.match.params.pageId, this.state.page);
    Promise.resolve(response).then(() => {
      this.setState({ initialPage: this.state.page });
      this.editModeOff();
      this.props.toast("Page saved!");
    }, () => {
      this.props.toast("Failed to save!");
    });
  }
}

const mapStateToProps = (state: IAppState) => ({
  allowedToEdit: state.auth.user !== null,
});

const mapDispatchToProps = (dispatch: Dispatch<IToastAction>) => ({
  toast: (text: string) => dispatch(Toast(text)),
});

export const DynamicPage = connect(mapStateToProps, mapDispatchToProps)(UnconnectedDynamicPage);
