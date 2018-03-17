import java.net.URL

import moe.roselia.NaiveJSON.DSL._
import moe.roselia.NaiveJSON.Parsers
import moe.roselia.NaiveJSON.States.{Failure, Parser, Success}
import moe.roselia.NaiveJSON.reflect._

import scala.io.Source
import scala.util.matching.Regex



object RoseliaEncore {
  case class Album(id: Int, title: String, track: List[String], releaseDate: String)
  case class TrackParser(group: String = "Roselia") extends Parsers {
    self =>
    def find(s: String): Parser[String] = input => {
      val msg = s"Expect String: " + s.toQuoted
      val idx = input.input.indexOf(s)
      if (idx != -1) Success(s, idx + s.length)
      else Failure(input.loc.toError(msg), false)
    }

    def find(r: Regex): Parser[String] = s => r.findFirstIn(s.input) match {
      case None => Failure(s.loc.toError(s"Match: /$r/"), false)
      case Some(m) => Success(m, s.input.indexOf(m) + m.length)
    }

    def andNot[A, B](p1: Parser[A], p2: Parser[B]): Parser[A] = input => p1(input) match {
      case s@Success(r, c) => p2(input) match {
        case Failure(_, _) => s
        case Success(re, cnt) => Failure(input.loc.advanceBy(c).advanceBy(cnt).toError(s"Expected $r but unexpected $re"), false)
      }
      case f => f
    }

    implicit def finderOps[A](p: Parser[A]): FinderOps[A] = FinderOps(p)

    implicit def asStringFinder[A](a: A)(implicit f: A => Parser[String]): FinderOps[String] = FinderOps(f(a))

    case class FinderOps[+A](p: Parser[A]) {
      def &![B](p2: Parser[B]): Parser[A] = andNot(p, p2)

      def finder: Parser[A] = self.find(p)

      def \\[B](p2: => Parser[B]): Parser[(A, B)] = parallel(p, p2)
    }

    def quotedWith(s: String, t: String): Parser[String] =
      s *> thru(t).map(_ dropRight 1)

    def any: Parser[String] = ".".r

    def find[A](p: Parser[A]) = many(andNot(any, p | eof)) *> p

    def htmlSpace = many(List("<br />", "<br/>", "</p>", "<p>").map(_.token).reduce(_ | _)) | whiteSpace

    def albumType = List("Single", "Album", "シングル", "アルバム").map(find).reduce(_ | _) scope "Album"

    def albumTitle = find(find(group) *> "[^「]*".r *> quotedWith("「", "」"))

    def albumTracks = (find("[CD]") | find("【CD収録内容】")) *> htmlSpace *> many(int *> "." *> "((?!<br)(?!<\\/).)*".r <* htmlSpace).token

    def releaseDate = find("【発売日】") *> htmlSpace *>
      (~((int <* "年") ** (int <* "月") ** (int <* "日")) | ((int <* "月") ** (int <* "日"))).map {
        case ((y, m), d) => s"$y-$m-$d"
        case (m, d) => s"$m-$d"
      } scope "Release date"

    def albumIdx = find(find(group) *> int <* ("st" | "nd" | "rd" | "th") <* token(albumType))

    def parallel[A, B](p: Parser[A], p2: => Parser[B]): Parser[(A, B)] = input => {
      p(input) match {
        case Success(r, c) => p2(input) match {
          case Success(r2, c2) => Success((r, r2), c + c2)
          case f@Failure(_, _) => f
        }
        case f@Failure(_, _) => f
      }
    }

    def getAlbum: Parser[Album] = albumIdx \\ albumTitle \\ albumTracks \\ releaseDate map {
      case (((a, b), c), d) => Album(a, b, c, d)
    }

    def getJSONString = getAlbum map (fromPlainClass(_).format)
  }

  def main(args: Array[String]): Unit = {
    val url = "https://bang-dream.com/cd/roselia-1st%E3%82%A2%E3%83%AB%E3%83%90%E3%83%A0%E3%80%8Canfang%E3%80%8D/"
    parseJSON(scrapURL(url)) mapSuccess println
  }

  def scrapURL(path: String) ={
    val url = new URL(path)
    Source.fromURL(url, "utf8").mkString
  }

  def parseJSON(info: String, group:String = "Roselia")= {
    val p = TrackParser(group)
    import p._
    getJSONString >> info
  }
}
