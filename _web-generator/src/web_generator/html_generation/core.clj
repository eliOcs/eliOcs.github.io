
(ns web-generator.html-generation.core
  (:require [web-generator.content.core :as content]
            [clj-time.core :as time]
            [clj-time.format :as time-format]
            [hiccup.page :as hiccup]
            [me.raynes.conch :as sh]
            [me.raynes.fs :as fs]))

(load "common")

(load "resume/summary")
(load "resume/work_experience")
(load "resume/education")
(load "resume")

(load "interesting-content")

(load "index")
