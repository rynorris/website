import * as React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

import { ContactForm } from "../components/contact-form";
import { ContactDetails } from "../services/site-service";
import { AppState } from "../state/model";
import { connect } from "react-redux";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sectionDivider: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

interface IDispatchProps {
  contact: ContactDetails;
}

type IContactPageProps = IDispatchProps;

const ContactPage: React.SFC<IContactPageProps> = ({ contact }) => {
  const classes = useStyles();

  return (
    <div className="contact-page">
      <Card>
        <CardHeader title="Contact Us" />
        <CardContent>
          <Typography>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></Typography>
          <Divider className={classes.sectionDivider}/>

          <Typography>Phone: <a href={`tel:${contact.phone}`}>{contact.phone}</a></Typography>
          <Divider className={classes.sectionDivider}/>

          <Typography>Or via this webform:</Typography>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
};

const mapStateToProps = ({ site }: AppState) => ({
  contact: site.contact,
});

export const ConnectedContactPage = connect(mapStateToProps)(ContactPage);