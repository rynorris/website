import * as React from "react";
import {Card, CardTitle, CardText} from "material-ui/Card";
import Divider from "material-ui/Divider";

import ContactForm from "../components/contact-form";
import { ContactDetails } from "../services/site-service";
import { AppState } from "../state/model";
import { connect } from "react-redux";

interface IDispatchProps {
  contact: ContactDetails;
}

type IContactPageProps = IDispatchProps;

const ContactPage = ({ contact }: IContactPageProps) => (
  <div className="contact-page">
    <Card>
      <CardTitle title="Contact Us" />
      <CardText>
        <p>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
        <Divider className="contact-page-divider" />

        <p>Phone: <a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
        <Divider className="contact-page-divider" />

        <p>Or via this webform:</p>
        <ContactForm />
      </CardText>
    </Card>
  </div>
);

const mapStateToProps = ({ site }: AppState) => ({
  contact: site.contact,
});

export const ConnectedContactPage = connect(mapStateToProps)(ContactPage);