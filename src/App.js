import './App.css';
import Questionnaire from './questionaire/index';

function App() {
  const questionnaireInfo = {
    rule : `
    if (Q1.answer == 0) then show Q2
    if (Q1.answer == 1) then show Q3
    `,
    data :[
      {
        qName: 'Q1',
        text: '你喜欢哪种类型的游戏？',
        options: ['动作','策略','无'],
        answer: null,
        show: true
      },
      {
        qName: 'Q2',
        text: '你玩过只狼吗？',
        options: ['玩过','没有'],
        answer: null,
        show: false
      },
      {
        qName: 'Q3',
        text: '你玩过文明吗？',
        options: ['玩过','没有'],
        answer: null,
        show: false
      }
    ]
  } 
  return (
    <div className="App">
      <header className="App-header">
        <Questionnaire data={questionnaireInfo.data} rule={questionnaireInfo.rule}></Questionnaire>
      </header>
    </div>
  );
}

export default App;
