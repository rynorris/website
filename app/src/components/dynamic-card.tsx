import * as React from "react";

import Typography from "@material-ui/core/Typography";

import { BioCard } from "../components/bio-card";
import { Post } from "../components/post";
import { ICard } from "../services/pages-service";

// Hack in the module since I can't figure out how to write typings.
declare var require: any;
// tslint:disable: no-var-requires
const Markdown: any = require("react-markdown");

interface IDynamicCardProps {
  card: ICard;
}

export const DynamicCard: React.SFC<IDynamicCardProps> = ({ card }) => {
    switch (card.type) {
      case "post":
        return <Post title={card.title} image={card.image}><Markdown className="card-body" source={card.text} /></Post>;
      case "bio":
        return <BioCard name={card.title} image={card.image}><Markdown source={card.text} /></BioCard>;
    }
};
