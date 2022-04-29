import { useState, useRef } from 'react';
import { IconText } from './icons';
import Input from './components/Input';
import RadioButtonGroup from './components/RadioButtonGroup';
import { getRandom } from './utils';
import cn from 'classnames';
import randomWords from 'random-words';

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
    <div className="p-4 bg-white shadow-sm">
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
    <section className="bg-white p-3 shadow-sm">
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

  const handlePreProcess = () => {
    // console.log(filepathRef.current.value);
    // console.log(articleNumRef.current.value);
    // console.log(categoryNumRef.current.value);
    // console.log(dimensionReduction);
    setWords({
      singleWords: Array.from(
        { length: categoryNumRef.current.value || 3 },
        () => {
          return {
            name: randomWords(),
            words: Array.from(
              { length: getRandom(15, 30) },
              () => `${randomWords()}`
            ),
          };
        }
      ),
      // singleWords: randomWords({ min: 15, max: 30 }),
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
                min="0"
                id="articleNum"
              />
              <Input
                ref={categoryNumRef}
                placeholder="类别数"
                className="min-w-0 pr-0"
                type="number"
                min="0"
                id="classNum"
              />
            </div>
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

        <main className="flex-1 pb-2">
          <div className="space-y-3">
            <HighFrequencyWordSet wordGroup={words.singleWords} />
            <div className="grid grid-cols-2 gap-3">
              <WordSet title="二元词" words={words.doubleWords} />
              <WordSet title="三元词" words={words.tripleWords} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
