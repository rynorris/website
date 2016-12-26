import * as React from "react";
import * as _ from "lodash";
import {Card, Page, PagesService} from "../services/pages-service";
import ServiceProvider from "../services/service-provider";
import BioCard from "../components/bio-card";
import CardEditor from "../components/card-editor";
import EditContainer from "../components/edit-container";
import Post from "../components/post";

interface IDynamicPageProps {
  pageId: string;
}

interface IDynamicPageState {
  page: Page;
  editable: boolean;
  editorOpen: boolean;
  cardToEdit: number;
}

export default class DynamicPage extends React.Component<IDynamicPageProps, IDynamicPageState> {
  constructor(props: IDynamicPageProps) {
    super(props);
    this.state = {
      page: {title: "", cards: []},
      editable: true,
      editorOpen: false,
      cardToEdit: 0,
    };
  }

  componentDidMount() {
    let pageService: PagesService = ServiceProvider.PagesService();
    let response: Promise<Page> = pageService.loadPage(this.props.pageId);
    Promise.resolve(response).then((page) => {
      let newState = this.state;
      newState.page = page;
      this.setState(newState);
    }, () => {
    });
  }

  render() {
    let cards: any = _.map(this.state.page.cards, (card: Card, ix: number) => {
      switch (card.type) {
        case "post":
          return <Post title={card.title}>{card.text}</Post>;
        case "bio":
          return <BioCard name={card.title} text={card.text} image={card.image} />;
      }
    });

    let wrapped: any = _.map(cards, (card: Card, ix: number) => {
      return (
        <EditContainer
          key={"card_" + ix}
          editable={this.state.editable}
          onEditButtonClick={(() => this.editCard(ix)).bind(this)}>
          {card}
        </EditContainer>
      );
    });

    return (
      <div>
        {wrapped}
        <CardEditor
          open={this.state.editorOpen}
          onRequestClose={this.handleClose.bind(this)}
          card={this.state.page.cards[this.state.cardToEdit]}
          onSave={((card: Card) => {this.saveCard(this.state.cardToEdit, card)}).bind(this)}
          />
      </div>
    );
  }

  private handleClose() {
    let newState = this.state;
    newState.editorOpen = false;
    this.setState(newState);
  }

  private editCard(ix: number) {
    let newState = this.state;
    newState.cardToEdit = ix;
    newState.editorOpen = true;
    this.setState(newState);
  }

  private saveCard(ix: number, card: Card) {
    // Clone page in case the set operation fails.
    let newPage: Page = JSON.parse(JSON.stringify(this.state.page));
    newPage.cards[ix] = card;
    let pageService: PagesService = ServiceProvider.PagesService();
    let response: Promise<any> = pageService.savePage(this.props.pageId, newPage)
    Promise.resolve(response).then(() => {
      let newState = this.state;
      newState.page = newPage;
      newState.editorOpen = false;
      this.setState(newState);
    }, (e) => {
      console.log("Something went wrong: ", e);
    });
  }
}
