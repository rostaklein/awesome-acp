import React from "react";
import * as Sentry from "@sentry/react";
import { Result, Button } from "antd";

export default class ErrorBoundary extends React.Component<
  unknown,
  { error: Error | null }
> {
  constructor(props: unknown) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ error });
    Sentry.configureScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });
    });
    Sentry.captureException(error);
  }

  render() {
    if (this.state.error) {
      // render fallback UI
      return (
        <Result
          status="warning"
          title="Ouch, something went wrong"
          extra={
            <div>
              <p>Our gremlins are working on a fix already, dont worry.</p>
              <Button type="primary" onClick={window.location.reload}>
                Refresh the window
              </Button>
            </div>
          }
        />
      );
    } else {
      // when there's not an error, render children untouched
      return this.props.children;
    }
  }
}
