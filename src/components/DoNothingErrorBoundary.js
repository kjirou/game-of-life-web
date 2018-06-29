// @flow

import * as React from 'react';

type Props = {
  children: React.Node,
};

/**
 * 何もしないというエラーハンドリングの設定
 *
 * エラーハンドリングの設定を全くしない場合、コンポーネントのコンストラクタで例外が発生した際に
 * デフォルトの挙動が recreate を試みてしまい、結果として二重にエラーが出力されてしまう。
 * その対策として作成したもの。
 */
export default class DoNothingErrorBoundary extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidCatch() {
  }

  render() {
    return this.props.children;
  }
}
