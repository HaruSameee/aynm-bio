/*
 * BGM の差し込み口。
 * 音声ファイルを用意したら BGM_SRC にパスを入れるだけで、
 * タイトル画面の「クリック／タップでスタート」を起点に再生が始まる。
 * （ブラウザの自動再生制限により、再生開始はユーザー操作の中で行う必要がある）
 */
export const BGM_SRC: string | null = null; // 例: "/hrsm/assets/audio/title.ogg"
export const BGM_VOLUME = 0.5;

export type BgmController = {
  play: () => void;
  stop: () => void;
};

export function createBgmController(): BgmController {
  let audio: HTMLAudioElement | null = null;

  return {
    play() {
      if (!BGM_SRC) {
        return;
      }

      if (!audio) {
        audio = new Audio(BGM_SRC);
        audio.loop = true;
        audio.volume = BGM_VOLUME;
      }

      // 再生失敗（自動再生ブロック・ファイル欠落など）で画面を止めない
      audio.play().catch(() => {});
    },
    stop() {
      audio?.pause();
    },
  };
}
