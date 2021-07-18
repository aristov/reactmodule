import {
  HtmlImg, HtmlBody, HtmlHeader, HtmlMain, HtmlFooter,
} from '../lib'
import './index.css'

class SiteBody extends HtmlBody
{
  render() {
    return [
      new HtmlHeader(new HtmlImg({ src : 'crazy7.jpg', alt : 'UserPic' })),
      new HtmlMain(),
      new HtmlFooter(),
    ]
  }
}

export default () => new SiteBody({ node : document.body })
