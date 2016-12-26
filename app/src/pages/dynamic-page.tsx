import * as React from "react";
import * as _ from "lodash";
import {Card, Page, PagesService} from "../services/pages-service";
import ServiceProvider from "../services/service-provider";
import BioCard from "../components/bio-card";
import EditContainer from "../components/edit-container";
import Post from "../components/post";

interface IDynamicPageProps {
  pageId: string;
}

interface IDynamicPageState {
  page: Page;
  editable: boolean;
}

export default class DynamicPage extends React.Component<IDynamicPageProps, IDynamicPageState> {
  constructor(props: IDynamicPageProps) {
    super(props);
    this.state = {
      page: {title: "", cards: []},
      editable: true,
    };
  }

  componentDidMount() {
    let pageService: PagesService = ServiceProvider.PagesService();
    let response: Promise<Page> = pageService.loadPage(this.props.pageId);
    Promise.resolve(response).then((page) => {
      this.setState({page: page, editable: this.state.editable});
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
        <EditContainer key={"card_" + ix} editable={this.state.editable}>
          {card}
        </EditContainer>
      );
    });

    return (
      <div>
        {wrapped}
      </div>
    );
  }
}
