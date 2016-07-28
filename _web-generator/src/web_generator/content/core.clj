(ns web-generator.content.core
  (:require [web-generator.content.parser :as parser]))

(defn filename
  [name]
  (str "src/web_generator/content/" name ".yaml"))

(def ^:private load-content-file (comp parser/parse slurp filename))

(def work-experience (load-content-file "work_experience"))
