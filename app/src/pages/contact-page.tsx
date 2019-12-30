import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import { connect } from "react-redux";
import { ContactForm } from "../components/contact-form";
import { IContactDetails } from "../services/site-service";
import { IAppState } from "../state/model";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contactCard: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    sectionDivider: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
  }),
);

interface IDispatchProps {
  contact?: IContactDetails;
}

type IContactPageProps = IDispatchProps;

const ContactPage: React.SFC<IContactPageProps> = ({ contact }) => {
  const classes = useStyles();

  const content = contact != null ? (
    <CardContent>
      <Typography>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></Typography>
      <Divider className={classes.sectionDivider} />

      <Typography>Phone: <a href={`tel:${contact.phone}`}>{contact.phone}</a></Typography>
      <Divider className={classes.sectionDivider} />

      <Typography>Or via this webform:</Typography>
      <ContactForm />
    </CardContent>
  ) : (
      <CardContent />
    );

  return (
    <Card className={classes.contactCard}>
      <CardHeader title="Contact Us" />
      {content}
    </Card>
  );
};

const mapStateToProps = ({ site }: IAppState) => ({
  contact: site != null ? site.contact : undefined,
});

export const ConnectedContactPage = connect(mapStateToProps)(ContactPage);
