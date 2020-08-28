export type Record = {
  id: string;
  createdTime: string;
  fields: {
    id: string;
    date: string;
    product_hunt_data: string;
    dev_to_data: string;
    hn_data: string;
  };
};

export type AirTableData = {
  records: Record[];
};

export type ProductHuntPosts = {
  data: {
    posts: {
      edges: {
        node: {
          id: string;
          name: string;
          tagline: string;
          thumbnail: {
            url: string;
          };
          url: string;
          votesCount: number;
          commentsCount: number;
        };
      }[];
    };
  };
};

export type HNPostData = {
  url?: string;
  title: string;
  score: number;
  kids?: number[];
  id: string;
};

export type HNStories = HNPostData[];

export type DevToData = {
  title: string;
  url: string;
  positive_reactions_count: number;
  tag_list: string[];
}[];
