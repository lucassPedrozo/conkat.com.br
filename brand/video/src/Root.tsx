import { Composition } from 'remotion';
import { Video } from './Video';
import { DURATION_S, FPS, H, W } from './tokens';

export const Root = () => (
  <>
    <Composition id="Divulgacao" component={Video} durationInFrames={DURATION_S * FPS} fps={FPS} width={W} height={H} defaultProps={{ muted: false }} />
    <Composition id="DivulgacaoSemAudio" component={Video} durationInFrames={DURATION_S * FPS} fps={FPS} width={W} height={H} defaultProps={{ muted: true }} />
  </>
);
