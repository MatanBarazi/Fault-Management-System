import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  text: {
    margin: theme.spacing(0, 0, 0.5),
  },
  avatar: {
    verticalAlign: "middle",
    marginRight: theme.spacing(0.5),
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: theme.spacing(2, 2, 0),
  },
  card: {
    borderRadius: 15,
    maxWidth: "100%",
    minWidth: "100%",
    padding: '0% 5%',
    backgroundColor: theme.palette.background.card,
  },
  dialogTitle : {
    color: "rgba(246, 0, 0, 0.87)"
  },
  cardContent: {
    padding: theme.spacing(2, 0, 0, 0),
  },
  cardActions: {
        padding: '0 16% 8% 15%',
        display: 'flex',
        justifyContent: 'space-between',
      },
}));