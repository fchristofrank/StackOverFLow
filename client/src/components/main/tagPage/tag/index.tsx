import React, { useEffect, useState } from 'react';
import './index.css';
import { getTagByName } from '../../../../services/tagService';

/**
 * Interface of the Tag component.
 *
 * name - The name of the tag
 * description - The description of the tag
 */
interface TagInterface {
  name: string;
  description: string;
}

/**
 * Props for the Tag component.
 *
 * t - The tag object.
 * t.name - The name of the tag t, used to fetch additional details and handle clicks.
 * t.qcnt - The number of questions associated with this tag t.
 * clickTag - Function to handle the tag click event.
 */
interface TagProps {
  t: {
    name: string;
    qcnt: number;
  };
  clickTag: (tagName: string) => void;
}

/**
 * Tag component that displays information about a specific tag.
 * The component displays the tag's name, description, and the number of associated questions.
 * It also triggers a click event to handle tag selection.
 *
 * @param t - The tag object .
 * @param clickTag - Function to handle tag clicks.
 */
const Tag = ({ t, clickTag }: TagProps) => {
  const [tag, setTag] = useState<TagInterface>({
    name: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTagByName(t.name);
        setTag(res || { name: 'Error', description: 'Error' });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    };
    fetchData();
  }, [t.name]);

  return (
    <div
      className='tagNode'
      onClick={() => {
        clickTag(t.name);
      }}
    >
      <div className='tagName'>{tag.name}</div>
      <div className='tagDescription'>{tag.description}</div>
      <div>{t.qcnt} questions</div>
    </div>
  );
};

export default Tag;
