import { useState, useRef } from 'react';
import { IconText } from './icons';
import Input from './components/Input';
import { getRandom } from './utils';
import cn from 'classnames';
import randomWords from 'random-words';

const buttonDefaultClass =
  'px-4 py-1 border hover:bg-light-300 active:bg-light-600';

function WordSet(props) {
  const { title, words } = props;
  return (
    <section className="border p-3">
      <h2 className="inline-block text-base px-4 py-1.5 mb-3 bg-light-200 rounded">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2 text-sm">
        {words.map((word) => (
          <span className="inline-block border px-2 py-1 hover:bg-light-200">
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
  const classNumRef = useRef();

  const [words, setWords] = useState({
    singleWords: [],
    doubleWords: [],
    tripleWords: [],
  });

  const [precision, setPrecision] = useState(-1);

  const handlePreProcess = () => {
    setWords({
      singleWords: randomWords({ min: 15, max: 30 }),
      doubleWords: Array.from(
        { length: getRandom(15, 30) },
        () => `${randomWords()}${randomWords()}`
      ),
      tripleWords: Array.from(
        { length: getRandom(15, 30) },
        () => `${randomWords()}${randomWords()}${randomWords()}`
      ),
    });
  };

  const handleClassifier = () => {
    console.log(setPrecision(Math.random()));
  };

  return (
    <div className="flex flex-col gap-2 min-h-screen bg-light-400">
      <header className="flex items-center gap-3 px-4 py-2 bg-white">
        <IconText className="text-lg text-gray-600" />
        <h1 style={{ fontFamily: 'Consolas' }} className="text-lg font-faml">
          Text Classifier
        </h1>
      </header>
      <div className="flex-1 flex gap-2 px-2 text-sm">
        <aside className="w-2/12 min-w-48 p-4 bg-white space-y-3">
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
                min="0"
                id="articleNum"
              />
              <Input
                ref={classNumRef}
                placeholder="类别数"
                className="min-w-0 pr-0"
                type="number"
                min="0"
                id="classNum"
              />
            </div>
          </div>

          <button
            className={cn(buttonDefaultClass, 'w-full')}
            onClick={handlePreProcess}
          >
            预处理
          </button>

          <button
            className={cn(buttonDefaultClass, 'w-full')}
            onClick={handleClassifier}
          >
            分类
          </button>
          {precision > 0 && (
            <div>
              <p className="px-4 py-2 mt-4 bg-light-100">
                精确度：{precision.toFixed(6)}
              </p>
            </div>
          )}
        </aside>

        <main className="flex-1 bg-white">
          <div className="grid grid-cols-2 gap-4 p-5">
            <WordSet title="一元词" words={words.singleWords} />
            <WordSet title="二元词" words={words.doubleWords} />
            <WordSet title="三元词" words={words.tripleWords} />
          </div>
        </main>
      </div>
    </div>
  );
}
