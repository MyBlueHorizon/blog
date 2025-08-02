interface GitalkConfig {
  enable: boolean;
  owner: string;
  repo: string;
  client_id: string;
  client_secret: string;
  id: string;
}

export interface CommentConfig {
  gitalk?: GitalkConfig;
}
