import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useActions } from '../../hooks/useActions';
import { QuizState } from '../../state/reducers/quizReducer';
import { Alert } from '../Utils/Alert';

const useStyles = makeStyles({
  root: {
    width: '100%',
    marginBottom: 20,
    flexShrink: 0,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
  },
  loadBtn: { color: '#3C55E0', fontSize: 14 },
});

interface QuizCardProps {
  quiz: QuizState;
  setShowLoadQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  resetQuizStates:()=>void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  setShowLoadQuiz,
  resetQuizStates,
}) => {
  const { showAlert, hideAlert, loadQuiz } = useActions();

  const classes = useStyles();
  return (
    <>
      <Alert />
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.title}>{quiz.quizTitle}</Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => {
              loadQuiz(quiz);
              resetQuizStates()
              setShowLoadQuiz(false);
            }}
            className={classes.loadBtn}
            size="small"
          >
            Load Quiz
          </Button>
          <Button
            onClick={async () => {
              try {
              } catch (error) {
                showAlert('Quiz failed to delete', 'error');
                setTimeout(() => {
                  hideAlert();
                }, 1500);
              }
            }}
            color="secondary"
          >
            Delete Quiz
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
