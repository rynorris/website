import * as React from "react";

import BioCard from "../components/bio-card";
import Post from "../components/post";
import {Card} from "../services/pages-service";

interface IDynamicCardProps {
  card: Card;
}

export default class DynamicCard extends React.Component<IDynamicCardProps, {}> {
  render() {
    let card: Card = this.props.card;
    switch (card.type) {
      case "post":
        return <Post title={card.title}>{card.text}</Post>;
      case "bio":
        return <BioCard name={card.title} text={card.text} image={card.image} />;
    }
  }
}
