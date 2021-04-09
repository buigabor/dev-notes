import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { useActions } from '../../hooks/useActions';
import { QuizState } from '../../state/reducers/quizReducer';

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
  resetQuizStates: () => void;
  quizes: QuizState[];
  setQuizes: React.Dispatch<React.SetStateAction<QuizState[]>>;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  setShowLoadQuiz,
  resetQuizStates,
  quizes,
  setQuizes,
}) => {
  const { showAlert, hideAlert, loadQuiz } = useActions();

  const classes = useStyles();
  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.title}>{quiz.quizTitle}</Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => {
              loadQuiz(quiz);
              resetQuizStates();
              setShowLoadQuiz(false);
              showAlert('Quiz loaded!', 'success');
              setTimeout(() => {
                hideAlert();
              }, 1500);
            }}
            className={classes.loadBtn}
            size="small"
          >
            Load Quiz
          </Button>
          <Button
            onClick={async () => {
              try {
                console.log('clicked')
                const res = await axios.delete(
                  `http://localhost:4005/quiz/${quiz.id}`,
                  { withCredentials: true },
                );
                const deletedQuiz = res.data.data.quiz;
                if (!deletedQuiz) {
                  showAlert('Quiz failed to delete', 'error');
                  return setTimeout(() => {
                    hideAlert();
                  }, 1500);
                }
                if (quizes && deletedQuiz) {
                  setQuizes(
                    quizes.filter((quiz) => quiz.id !== deletedQuiz.id),
                  );
                  showAlert('Quiz successfully deleted!', 'success');
                  return setTimeout(() => {
                    hideAlert();
                  }, 1500);
                }
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
