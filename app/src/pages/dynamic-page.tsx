import * as React from "react";
import { map } from "lodash";
import {Unsubscribe} from "redux";
import ContentAdd from "material-ui/svg-icons/content/add";
import ContentCreate from "material-ui/svg-icons/content/create";
import ContentSave from "material-ui/svg-icons/content/save";
import FloatingActionButton from "material-ui/FloatingActionButton";
import NavigationCancel from "material-ui/svg-icons/navigation/cancel";

import {Card, Page, PagesService} from "../services/pages-service";
import ServiceProvider from "../services/service-provider";
import { CardEditor } from "../components/card-editor";
import { DynamicCard } from "../components/dynamic-card";
import { EditContainer } from "../components/edit-container";
import Toaster from "../components/toaster";

import {store} from "../state/store";
import { string } from "prop-types";
import { RouteComponentProps } from "react-router";

interface MatchParams {
  pageId: string;
}

interface IDynamicPageProps extends RouteComponentProps<MatchParams> {}

interface IDynamicPageState {
  initialPage: Page;
  page: Page;
  allowedToEdit: boolean;
  editable: boolean;
  editorOpen: boolean;
  cardToEdit: number;
}

export default class DynamicPage extends React.Component<IDynamicPageProps, IDynamicPageState> {
  private unsubscribe: Unsubscribe;

  constructor(props: IDynamicPageProps) {
    super(props);
    this.state = {
      initialPage: {title: "", cards: []},
      page: {title: "", cards: []},
      allowedToEdit: store.getState().auth.user ? true : false,
      editable: false,
      editorOpen: false,
      cardToEdit: 0,
    };
  }

  componentDidMount() {
    this.loadPage();

    this.unsubscribe = store.subscribe(() => {
      let loggedIn = store.getState().auth.user ? true : false;
      if (loggedIn !== this.state.allowedToEdit) {
        this.setState(Object.assign({}, this.state, { allowedToEdit: loggedIn }));
      }
    });
  }

  componentDidUpdate(prevProps: IDynamicPageProps) {
    if (prevProps.match.params.pageId !== this.props.match.params.pageId) {
      this.loadPage();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    let cards: JSX.Element[] = map(this.state.page.cards, (card: Card, ix: number) => {
      return <DynamicCard card={card} />;
    });

    let wrapped: any = map(cards, (card: Card, ix: number) => {
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

    let editButton: JSX.Element = (
      <FloatingActionButton className="floating-button" mini={true} onClick={this.editModeOn.bind(this)}>
        <ContentCreate />
      </FloatingActionButton>
    );

    let cancelButton: JSX.Element = (
      <FloatingActionButton className="floating-button" mini={true} onClick={this.cancelEdit.bind(this)}>
        <NavigationCancel />
      </FloatingActionButton>
    );

    let saveButton: JSX.Element = (
      <FloatingActionButton className="floating-button" mini={true} onClick={this.savePage.bind(this)}>
        <ContentSave />
      </FloatingActionButton>
    );

    let addButton: JSX.Element = (
      <FloatingActionButton
        className="floating-button"
        mini={true}
        onClick={(() => { this.addCard(this.state.page.cards.length); }).bind(this)}
        >
        <ContentAdd />
      </FloatingActionButton>
    );

    const cardToEdit = this.state.page.cards[this.state.cardToEdit];

    let editorControls: JSX.Element = (
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
            onSave={((card: Card) => { this.saveCard(this.state.cardToEdit, card); }).bind(this)}
            />
        }
      </div>
    );

    return (
      <div>
        {wrapped}
        {this.state.allowedToEdit ? editorControls : null}
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
    let pageService: PagesService = ServiceProvider.PagesService();
    let response: Promise<Page> = pageService.loadPage(this.props.match.params.pageId);
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

  private addCard(ix: number, card?: Card) {
    let newCard: Card = card || {
      type: "post",
      title: "New Card",
      text: "",
      image: "",
    };

    // Clone page.
    let newPage: Page = JSON.parse(JSON.stringify(this.state.page));
    newPage.cards.splice(ix, 0, newCard);
    this.setState({ page: newPage });
  }

  private removeCard(ix: number): Card {
    // Clone page.
    let newPage: Page = JSON.parse(JSON.stringify(this.state.page));
    let removedCard = newPage.cards.splice(ix, 1);
    this.setState({ page: newPage });
    return removedCard[0];
  }

  private moveCard(fromIx: number, toIx: number) {
    if (toIx < 0 || toIx >= this.state.page.cards.length) {
      return;
    }

    let newPage: Page = JSON.parse(JSON.stringify(this.state.page));
    let card = newPage.cards.splice(fromIx, 1);
    newPage.cards.splice(toIx, 0, card[0]);
    this.setState({ page: newPage });
  }

  private saveCard(ix: number, card: Card) {
    // Clone page.
    let newPage: Page = JSON.parse(JSON.stringify(this.state.page));
    newPage.cards[ix] = card;
    this.setState({ page: newPage, editorOpen: false });
  }

  private savePage() {
    let pageService: PagesService = ServiceProvider.PagesService();
    let response: Promise<any> = pageService.savePage(this.props.match.params.pageId, this.state.page);
    Promise.resolve(response).then(() => {
      this.setState({ initialPage: this.state.page });
      this.editModeOff();
      Toaster.toast("Page saved!");
    }, (e) => {
      console.log("Something went wrong: ", e);
      Toaster.toast("Failed to save.");
    });
  }
}
