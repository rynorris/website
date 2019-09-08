import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import CreateIcon from "@material-ui/icons/Create";
import SaveIcon from "@material-ui/icons/Save";
import { map } from "lodash";
import * as React from "react";
import {Dispatch, Unsubscribe} from "redux";

import { CardEditor } from "../components/card-editor";
import { DynamicCard } from "../components/dynamic-card";
import { EditContainer } from "../components/edit-container";
import {ICard, IPage, PagesService} from "../services/pages-service";
import ServiceProvider from "../services/service-provider";

import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Toast, IToastAction } from "../state/actions";
import { IAppState } from "../state/model";

interface MatchParams {
  pageId: string;
}

interface IRouteProps extends RouteComponentProps<MatchParams> {}

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
  private unsubscribe: Unsubscribe;

  constructor(props: IDynamicPageProps) {
    super(props);
    this.state = {
      initialPage: {title: "", cards: []},
      page: {title: "", cards: []},
      editable: false,
      editorOpen: false,
      cardToEdit: 0,
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

  public componentWillUnmount() {
    this.unsubscribe();
  }

  public render() {
    const cards: JSX.Element[] = map(this.state.page.cards, (card: ICard, ix: number) => {
      return <DynamicCard card={card} />;
    });

    const wrapped: any = map(cards, (card: ICard, ix: number) => {
      return (
        <EditContainer
          key={"card_" + ix}
          editable={this.state.editable}
          onEditButtonClick={(() => this.editCard(ix)).bind(this)}
          onUpButtonClick={(() => this.moveCard(ix, ix - 1)).bind(this)}
          onDownButtonClick={(() => this.moveCard(ix, ix + 1)).bind(this)}
          onDeleteButtonClick={(() => this.removeCard(ix)).bind(this)}
          >
          {card}
        </EditContainer>
      );
    });

    const editButton: JSX.Element = (
      <Fab className="floating-button" size="medium" color="primary" onClick={this.editModeOn.bind(this)}>
        <CreateIcon />
      </Fab>
    );

    const cancelButton: JSX.Element = (
      <Fab className="floating-button" size="medium" color="primary" onClick={this.cancelEdit.bind(this)}>
        <CancelIcon />
      </Fab>
    );

    const saveButton: JSX.Element = (
      <Fab className="floating-button" size="medium" color="primary" onClick={this.savePage.bind(this)}>
        <SaveIcon />
      </Fab>
    );

    const addButton: JSX.Element = (
      <Fab
        className="floating-button"
        size="medium"
        color="primary"
        onClick={(() => { this.addCard(this.state.page.cards.length); }).bind(this)}
        >
        <AddIcon />
      </Fab>
    );

    const cardToEdit = this.state.page.cards[this.state.cardToEdit];

    const editorControls: JSX.Element = (
      <div>
        {!this.state.editorOpen &&
          <div className="floating-buttons">
            {this.state.editable ? null : editButton}
            {!this.state.editable ? null : addButton}
            {!this.state.editable ? null : cancelButton}
            {!this.state.editable ? null : saveButton}
          </div>
        }
        {(cardToEdit !== undefined && this.state.editorOpen) &&
          <CardEditor
            open={this.state.editorOpen}
            onRequestClose={this.handleClose.bind(this)}
            card={cardToEdit}
            onSave={((card: ICard) => { this.saveCard(this.state.cardToEdit, card); }).bind(this)}
            />
        }
      </div>
    );

    return (
      <div>
        {wrapped}
        {this.props.allowedToEdit ? editorControls : null}
      </div>
    );
  }

  private handleClose() {
    this.setState({ editorOpen: false});
  }

  private cancelEdit() {
    this.editModeOff();
    this.resetPage();
  }

  private loadPage() {
    const pageService: PagesService = ServiceProvider.PagesService();
    const response: Promise<IPage> = pageService.loadPage(this.props.match.params.pageId);
    Promise.resolve(response).then((page) => {
      this.setState({ initialPage: page, page });
    }, () => {
    });
  }

  private resetPage() {
    this.setState({ page: this.state.initialPage });
  }

  private editModeOn() {
    this.setEditMode(true);
  }

  private editModeOff() {
    this.setEditMode(false);
  }

  private setEditMode(on: boolean) {
    this.setState({ editable: on });
  }

  private editCard(ix: number) {
    this.setState({ cardToEdit: ix, editorOpen: true });
  }

  private addCard(ix: number, card?: ICard) {
    const newCard: ICard = card || {
      type: "post",
      title: "New Card",
      text: "",
      image: "",
    };

    // Clone page.
    const newPage: IPage = JSON.parse(JSON.stringify(this.state.page));
    newPage.cards.splice(ix, 0, newCard);
    this.setState({ page: newPage });
  }

  private removeCard(ix: number): ICard {
    // Clone page.
    const newPage: IPage = JSON.parse(JSON.stringify(this.state.page));
    const removedCard = newPage.cards.splice(ix, 1);
    this.setState({ page: newPage });
    return removedCard[0];
  }

  private moveCard(fromIx: number, toIx: number) {
    if (toIx < 0 || toIx >= this.state.page.cards.length) {
      return;
    }

    const newPage: IPage = JSON.parse(JSON.stringify(this.state.page));
    const card = newPage.cards.splice(fromIx, 1);
    newPage.cards.splice(toIx, 0, card[0]);
    this.setState({ page: newPage });
  }

  private saveCard(ix: number, card: ICard) {
    // Clone page.
    const newPage: IPage = JSON.parse(JSON.stringify(this.state.page));
    newPage.cards[ix] = card;
    this.setState({ page: newPage, editorOpen: false });
  }

  private savePage() {
    const pageService: PagesService = ServiceProvider.PagesService();
    const response: Promise<any> = pageService.savePage(this.props.match.params.pageId, this.state.page);
    Promise.resolve(response).then(() => {
      this.setState({ initialPage: this.state.page });
      this.editModeOff();
      this.props.toast("Page saved!");
    }, (e) => {
      console.log("Something went wrong: ", e);
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
