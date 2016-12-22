import * as React from "react";
import * as _ from "lodash";
import BioCard from "../components/bio-card";

const teachers = [
  {
    "name": "Ailsa Norris",
    "text": "Ailsa is a teacher.",
    "image": "",
  },
  {
    "name": "Margeret Brown",
    "text": "Margeret is a teacher.",
    "image": "",
  },
];

export default class TeachersPage extends React.Component<{}, {}> {
  render() {
    let cards = _.map(teachers, function(t, ix) {
      return <BioCard name={t.name} text={t.text} image={t.image} />
    });

    return (
      <div className="teachers-page">
        {cards}
      </div>
    );
  }
}
