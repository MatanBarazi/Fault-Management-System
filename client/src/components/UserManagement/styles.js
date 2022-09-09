import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  
  mainContainer: {
    display: 'flex',
    alignItems: 'center',
    margin:'0 auto',
  },
  smMargin: {
    margin: theme.spacing(1),
  },
  actionDiv: {
    textAlign: 'center',
  },
}));
