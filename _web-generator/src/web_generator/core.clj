(ns web-generator.core
  (:require [web-generator.html-generation.core :as html-generation])
  (:gen-class))

(defn -main
  [& args]
  (spit "../index" (html-generation/index-html) :append false)
  (spit "../resume" (html-generation/resume-html) :append false)
  (spit "../interesting-content" (html-generation/interesting-content-html) :append false)
  (System/exit 0))
