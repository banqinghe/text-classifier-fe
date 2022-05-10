import { useState, useRef } from 'react';
import { IconText, IconSpinner } from './icons';
import Input from './components/Input';
import RadioButtonGroup from './components/RadioButtonGroup';
import { getRandom } from './utils';
import cn from 'classnames';
import randomWords from 'random-words';
import message from './components/Message';

const buttonDefaultClass =
  'px-4 py-1 border hover:bg-light-300 active:bg-light-600';

function CategoryWordCard(props) {
  const { name, words } = props;
  return (
    <div className="p-4 space-y-2 rounded hover:bg-light-50 shadow hover:shadow-md">
      <div className="inline-block px-2 py-1 bg-light-300 text-base rounded shadow-sm">
        {name}
      </div>
      <ul className="grid grid-flow-col grid-rows-10 gap-x-4">
        {words.map((word, index) => (
          <li className="py-1 px-1 hover:bg-light-400 rounded" key={index}>
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HighFrequencyWordSet(props) {
  const { wordGroup } = props;
  return (
    <div className="p-4 bg-white shadow-sm max-h-[60vh] overflow-auto">
      <div className="flex items-center gap-4 mb-3">
        <h2 className="inline-block text-base px-4 py-1.5 bg-light-200 rounded">
          高频词汇
        </h2>
        <div>共有 {wordGroup.length} 个类别</div>
      </div>
      <div className="flex flex-wrap gap-6">
        {wordGroup.map(({ name, words }, index) => (
          <CategoryWordCard key={index} name={name} words={words} />
        ))}
      </div>
    </div>
  );
}

function WordSet(props) {
  const { title, words } = props;
  return (
    <section className="bg-white p-3 shadow-sm max-h-[50vh] overflow-auto">
      <h2 className="inline-block text-base px-4 py-1.5 mb-3 bg-light-200 rounded">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2 text-sm">
        {words.map((word, index) => (
          <span
            key={index}
            className="inline-block border px-2 py-1 hover:bg-light-200"
          >
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const filepathRef = useRef();
  const articleNumRef = useRef();
  const categoryNumRef = useRef();

  const [words, setWords] = useState({
    singleWords: [],
    doubleWords: [],
    tripleWords: [],
  });
  const [dimensionReduction, setDimensionReduction] = useState(false);
  const [precision, setPrecision] = useState(-1);
  const [waiting, setWaiting] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handlePreProcess = () => {
    const params = new URLSearchParams();
    if (
      !(
        filepathRef.current.value &&
        articleNumRef.current.value &&
        categoryNumRef.current.value
      )
    ) {
      message('信息未填写完整');
      return;
    }
    params.append('filePath', filepathRef.current.value);
    params.append('fileNumber', articleNumRef.current.value);
    params.append('categoryNumber', categoryNumRef.current.value);
    params.append('dimensionReduction', dimensionReduction);
    if (dimensionReduction) {
      params.append(
        'reductionNumber',
        Number(document.getElementById('reductionNumber').value)
      );
    }
    setWaiting(true);
    fetch('http://localhost:8080/preProcess?' + params)
      .then((res) => res.json())
      .then((res) => {
        setWaiting(false);
        if (res.code !== 200) {
          console.error('Failed to fetch');
          message('处理失败');
          return;
        }
        message('处理完成');
        const data = JSON.parse(res.data);
        setWords({
          singleWords: data.Keywords.map((item, index) => {
            return {
              name: '类别 ' + (index + 1),
              words: item,
            };
          }),
          doubleWords: data['2-gram'],
          tripleWords: data['3-gram'],
        });
      });
    // setWaiting(true);
    // setTimeout(() => {
    //   message('处理完成');
    //   setWaiting(false);
    //   setWords({
    //     singleWords: Array.from(
    //       { length: categoryNumRef.current.value || 3 },
    //       () => {
    //         return {
    //           name: randomWords(),
    //           words: Array.from(
    //             { length: getRandom(15, 30) },
    //             () => `${randomWords()}`
    //           ),
    //         };
    //       }
    //     ),
    //     // singleWords: randomWords({ min: 15, max: 30 }),
    //     doubleWords: Array.from(
    //       { length: getRandom(15, 30) },
    //       () => `${randomWords()}${randomWords()}`
    //     ),
    //     tripleWords: Array.from(
    //       { length: getRandom(15, 30) },
    //       () => `${randomWords()}${randomWords()}${randomWords()}`
    //     ),
    //   });
    // }, 2000);
  };

  const handleTrain = () => {
    // setPrecision(Math.random());
    setIsTraining(true);
    fetch('http://localhost:8000/gcForest/train')
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          message('训练成功');
          return;
        }
        message('训练失败');
      })
      .catch(() => {
        message('训练失败');
      })
      .finally(() => {
        setIsTraining(false);
      });
  };

  const handleTest = () => {
    fetch('http://127.0.0.1:8000/gcForest/test')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setTestResult(res);
        message('测试成功');
      })
      .catch(() => {
        message('测试失败');
      })
      .finally(() => {
        setIsTraining(false);
      });
  };

  const handleDimensionChange = (e) => {
    const targetValue = e.target.value;
    setDimensionReduction(targetValue === 'yes' ? true : false);
  };

  return (
    <div className="flex flex-col gap-2 min-h-screen bg-light-200">
      <header className="flex items-center gap-3 px-4 py-2 bg-white shadow-sm">
        <IconText className="text-lg text-gray-600" />
        <h1 style={{ fontFamily: 'Consolas' }} className="text-lg">
          Text Classifier
        </h1>
      </header>
      <div className="flex-1 flex gap-2 px-2 text-sm">
        <aside className="w-2/12 min-w-48 p-4 bg-white space-y-3 shadow-sm">
          <div className="p space-y-2">
            <Input
              ref={filepathRef}
              placeholder="文件路径"
              className="w-full"
              id="filepath"
            />
            <div className="flex gap-2">
              <Input
                ref={articleNumRef}
                placeholder="文章数"
                className="min-w-0 pr-0"
                type="number"
                min="1"
                id="articleNum"
              />
              <Input
                ref={categoryNumRef}
                placeholder="类别数"
                className="min-w-0 pr-0"
                type="number"
                min="1"
                id="classNum"
              />
            </div>

            {dimensionReduction && (
              <Input
                id="reductionNumber"
                type="number"
                placeholder="词频阈值"
                className="w-full"
              />
            )}
          </div>

          <RadioButtonGroup
            options={[
              { label: '降维', value: 'yes' },
              { label: '不降维', value: 'no' },
            ]}
            name="dimensionReduction"
            value={dimensionReduction}
            onChange={handleDimensionChange}
          />

          <button
            className={cn(buttonDefaultClass, 'w-full', {
              'bg-gray-200 opacity-50 hover:bg-gray-200 active:bg-gray-200':
                waiting,
            })}
            disabled={waiting}
            onClick={handlePreProcess}
          >
            预处理
          </button>

          <button
            className={cn(
              buttonDefaultClass,
              'w-full flex gap-2 items-center justify-center',
              {
                'opacity-50 cursor-wait': isTraining,
              }
            )}
            onClick={handleTrain}
            disabled={isTraining}
          >
            <IconSpinner
              className={cn(
                'text-sm animate-spin animate-duration-[2s] text-gray-600',
                {
                  block: isTraining,
                  hidden: !isTraining,
                }
              )}
            />
            <span>训练</span>
          </button>

          <button
            className={cn(buttonDefaultClass, 'w-full')}
            onClick={handleTest}
          >
            测试
          </button>
          {testResult && (
            <div
              className="px-4 py-2 mt-4 bg-light-100"
              style={{ fontFamily: 'Consolas' }}
            >
              {Object.entries(testResult).map(([title, value], index) => (
                <div>
                  <span className="inline-block w-22">{title}:</span>
                  <span>
                    {index === 3
                      ? Number(value).toFixed(2) + '%'
                      : Number(value).toFixed(6)}
                  </span>
                </div>
              ))}
              {/* <p className="px-4 py-2 mt-4 bg-light-100">
                精确度：{precision.toFixed(6)}
              </p> */}
            </div>
          )}
        </aside>

        <main
          className="relative flex-1 pb-2 overflow-hidden"
          style={{ height: waiting ? 'calc(100vh - 54px)' : undefined }}
        >
          <div className="space-y-3">
            <HighFrequencyWordSet wordGroup={words.singleWords} />
            <div className="grid grid-cols-2 gap-3">
              <WordSet title="二元词" words={words.doubleWords} />
              <WordSet title="三元词" words={words.tripleWords} />
            </div>
          </div>
          {waiting && (
            <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-white bg-opacity-80 backdrop-filter backdrop-blur">
              <div className="flex flex-col items-center transform -translate-y-8">
                <div className="text-lg mb-4 text-center">处理中 . . .</div>
                <IconSpinner className="text-3xl animate-spin animate-duration-[2s] text-gray-600" />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
