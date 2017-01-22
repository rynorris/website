import * as React from "react";

import BioCard from "../components/bio-card";
import Post from "../components/post";
import {Card} from "../services/pages-service";

// Hack in the module since I can't figure out how to write typings.
declare var require: any;
let Markdown: any = require("react-markdown");

interface IDynamicCardProps {
  card: Card;
}

export default class DynamicCard extends React.Component<IDynamicCardProps, {}> {
  render() {
    let card: Card = this.props.card;
    switch (card.type) {
      case "post":
        return <Post title={card.title} image={card.image}><Markdown className="card-body" source={card.text} /></Post>;
      case "bio":
        return <BioCard name={card.title} image={card.image}><Markdown source={card.text} /></BioCard>;
    }
  }
}
