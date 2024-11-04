import { CommentConfig } from '@/types/comment';
import { Anatolo } from './anatolo';
import { router } from './router';

let config: CommentConfig | null = null;

export async function load(retry = 3) {
  if (!config) return;
  const id = (await Anatolo.getPageTitle()).slice(0, 50);
  if (!id) return;
  if (config.gitalk?.enable && (window as any).Gitalk) {
    const gitalk = new (window as any).Gitalk({
      clientID: config.gitalk.client_id,
      clientSecret: config.gitalk.client_secret,
      repo: config.gitalk.repo, // The repository of store comments,
      owner: config.gitalk.owner,
      admin: [config.gitalk.owner],
      id, // Ensure uniqueness and length less than 50
      distractionFreeMode: false, // Facebook-like distraction free mode
    });
    gitalk.render('gitalk_container');
  }
}

router.onPageChange(() => load().catch(() => {}));

export function setConfig(conf: CommentConfig) {
  config = conf;
}
