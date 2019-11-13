// Remark: No tsx to keep setup simple but we might definitely add it
import * as React from 'react';
import { search } from './Api';

type Props = {
  bugId?: 1 | 2;
};

export default function AutocompleteField(props: Props) {
  // Contrary to the other implementation of AutocompleteField
  // This one shows intermediate results as soon as they get available
  // Instead of rejecting all intermediate results

  const lastQueryRef = React.useRef('');
  const lastSuccessfulQueryRef = React.useRef('');
  const [query, setQuery] = React.useState(lastQueryRef.current);
  const [searchResults, setSearchResults] = React.useState([] as string[]);

  React.useEffect(() => {
    const runQuery = async () => {
      const results = await search(query, 10);

      if (!lastQueryRef.current.startsWith(query) && props.bugId !== 1) {
        // If current field value does not start by query
        // Then we discard this query
        return;
      }
      if (
        lastQueryRef.current.startsWith(lastSuccessfulQueryRef.current) &&
        lastSuccessfulQueryRef.current.length > query.length &&
        !(props.bugId === 1 || props.bugId === 2)
      ) {
        // If we already got a longest subquery for current field value
        // Then we discard this query
        return;
      }

      lastSuccessfulQueryRef.current = query;
      setSearchResults(results);
    };
    runQuery();
  }, [query, props]);

  return React.createElement(
    'div',
    {},
    React.createElement('input', {
      role: 'input',
      value: query,
      onChange: evt => {
        const value = (evt.target as any).value;
        lastQueryRef.current = value;
        setQuery(value);
      }
    }),
    React.createElement('ul', {}, searchResults.map(r => React.createElement('li', { key: r }, r)))
  );
}
