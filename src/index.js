import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Create from "./Create";
import Empty from "./EmptyLotion";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <GoogleOAuthProvider clientId="690970820198-mf2rrravnj97i2da14veehqmdhiud5mf.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Empty />} />
            <Route path="/notes" element={<Empty />} />
            <Route
              path="/notes/:noteId/edit"
              element={<Create edit={true} />}
            />
            <Route path="/notes/:noteId" element={<Create edit={false} />} />
            {/* any other path */}
            <Route path="*" element={<Empty />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </>
);


reportWebVitals();
