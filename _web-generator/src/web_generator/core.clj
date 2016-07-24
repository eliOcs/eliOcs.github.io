(ns web-generator.core
  (:require [web-generator.content.core :as content]
            [web-generator.html-generation.core :as html-generation])
  (:gen-class))

(defn -main
  [& args]
  (println (html-generation/work-experience-html content/work-experience)))
