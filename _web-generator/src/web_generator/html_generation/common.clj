(defn escape-multiline-text
  [string]
  (loop [[first-line & rest] (clojure.string/split string #"\n") result []]
    (if (empty? rest)
      (conj result first-line)
      (recur rest (conj result first-line [:br])))))

(defn head-html
  [title description]
  [:head
    [:meta {:charset "utf8"}]
    [:meta {:http-equiv "x-ua-compatible" :content "ie=edge"}]
    [:meta {:name "viewport" :content "width=device-width, initial-scale=1"}]
    [:title title]
    [:meta {:name "description" :content description}]
    (hiccup/include-css "css/normalize.css")
    (hiccup/include-css "css/main.css")])
