import * as React from "react";
import * as _ from "lodash";
import {Card, Page, PagesService} from "../services/pages-service";
import ServiceProvider from "../services/service-provider";
import BioCard from "../components/bio-card";
import Post from "../components/post";

interface IDynamicPageProps {
  pageId: string;
}

interface IDynamicPageState {
  page: Page;
}

export default class DynamicPage extends React.Component<IDynamicPageProps, IDynamicPageState> {
  constructor(props: IDynamicPageProps) {
    super(props);
    this.state = {
      page: {title: "", cards: []},
    };
  }

  componentDidMount() {
    let pageService: PagesService = ServiceProvider.PagesService();
    let response: Promise<Page> = pageService.loadPage(this.props.pageId);
    Promise.resolve(response).then((page) => {
      this.setState({page: page});
    }, () => {
    });
  }

  render() {
    let cards: any = _.map(this.state.page.cards, (card: Card, ix: number) => {
      switch (card.type) {
        case "post":
          return <Post key={"card_" + ix} title={card.title}>{card.text}</Post>;
        case "bio":
          return <BioCard key={"card_" + ix} name={card.title} text={card.text} image={card.image} />;
      }
    });

    return (
      <div>
        {cards}
      </div>
    );
  }
}
