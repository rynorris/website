import * as React from "react";
import * as map from "lodash/map";
import ContentCreate from "material-ui/svg-icons/content/create";
import ContentSave from "material-ui/svg-icons/content/save";
import FloatingActionButton from "material-ui/FloatingActionButton";
import NavigationCancel from "material-ui/svg-icons/navigation/cancel";

import {Card, Page, PagesService} from "../services/pages-service";
import ServiceProvider from "../services/service-provider";
import CardEditor from "../components/card-editor";
import DynamicCard from "../components/dynamic-card";
import EditContainer from "../components/edit-container";
import Toaster from "../components/toaster";

import {store} from "../redux/state";

interface IDynamicPageProps {
  pageId: string;
}

interface IDynamicPageState {
  initialPage: Page;
  page: Page;
  allowedToEdit: boolean;
  editable: boolean;
  editorOpen: boolean;
  cardToEdit: number;
}

export default class DynamicPage extends React.Component<IDynamicPageProps, IDynamicPageState> {
  private toaster: Toaster;

  constructor(props: IDynamicPageProps) {
    super(props);
    this.state = {
      initialPage: {title: "", cards: []},
      page: {title: "", cards: []},
      allowedToEdit: store.getState().auth.loggedIn,
      editable: false,
      editorOpen: false,
      cardToEdit: 0,
    };
  }

  componentDidMount() {
    let pageService: PagesService = ServiceProvider.PagesService();
    let response: Promise<Page> = pageService.loadPage(this.props.pageId);
    Promise.resolve(response).then((page) => {
      let newState = this.state;
      newState.initialPage = page;
      newState.page = page;
      this.setState(newState);
    }, () => {
    });

    store.subscribe(() => {
      let loggedIn = store.getState().auth.loggedIn;
      if (loggedIn !== this.state.allowedToEdit) {
        this.setState(Object.assign({}, this.state, { allowedToEdit: loggedIn }));
      }
    });
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
          onEditButtonClick={(() => this.editCard(ix)).bind(this)}>
          {card}
        </EditContainer>
      );
    });

    let editButton: JSX.Element = (
      <FloatingActionButton className="floating-button" mini={true} onTouchTap={this.editModeOn.bind(this)}>
        <ContentCreate />
      </FloatingActionButton>
    );

    let cancelButton: JSX.Element = (
      <FloatingActionButton className="floating-button" mini={true} onTouchTap={this.cancelEdit.bind(this)}>
        <NavigationCancel />
      </FloatingActionButton>
    );

    let saveButton: JSX.Element = (
      <FloatingActionButton className="floating-button" mini={true} onTouchTap={this.savePage.bind(this)}>
        <ContentSave />
      </FloatingActionButton>
    );

    let editorControls: JSX.Element = (
      <div>
        <div className="floating-buttons">
          {this.state.editable ? null : editButton}
          {!this.state.editable ? null : cancelButton}
          {!this.state.editable ? null : saveButton}
        </div>
        <CardEditor
          open={this.state.editorOpen}
          onRequestClose={this.handleClose.bind(this)}
          card={this.state.page.cards[this.state.cardToEdit]}
          onSave={((card: Card) => {this.saveCard(this.state.cardToEdit, card);}).bind(this)}
          />
        <Toaster ref={(t) => { this.toaster = t; }} />
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
    let newState = this.state;
    newState.editorOpen = false;
    this.setState(newState);
  }

  private cancelEdit() {
    this.editModeOff();
    this.resetPage();
  }

  private resetPage() {
    let newState = this.state;
    newState.page = newState.initialPage;
    this.setState(newState);
  }

  private editModeOn() {
    this.setEditMode(true);
  }

  private editModeOff() {
    this.setEditMode(false);
  }

  private setEditMode(on: boolean) {
    let newState = this.state;
    newState.editable = on;
    this.setState(newState);
  }

  private editCard(ix: number) {
    let newState = this.state;
    newState.cardToEdit = ix;
    newState.editorOpen = true;
    this.setState(newState);
  }

  private saveCard(ix: number, card: Card) {
    // Clone page.
    let newPage: Page = JSON.parse(JSON.stringify(this.state.page));
    newPage.cards[ix] = card;

    let newState = this.state;
    newState.page = newPage;
    newState.editorOpen = false;
    this.setState(newState);
  }

  private savePage() {
    let pageService: PagesService = ServiceProvider.PagesService();
    let response: Promise<any> = pageService.savePage(this.props.pageId, this.state.page);
    Promise.resolve(response).then(() => {
      let newState = this.state;
      newState.initialPage = newState.page;
      this.setState(newState);
      this.editModeOff();
      this.toaster.toast("Page saved!");
    }, (e) => {
      console.log("Something went wrong: ", e);
      this.toaster.toast("Failed to save.");
    });
  }
}
