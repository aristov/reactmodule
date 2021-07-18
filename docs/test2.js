import {
  HtmlImg, HtmlBody, HtmlHeader, HtmlMain, HtmlFooter, HtmlH1,
} from '../lib'
import './index.css'

class SiteBody extends HtmlBody
{
  render() {
    return [
      new HtmlHeader(new HtmlImg({ src : 'crazy7.jpg', alt : 'UserPic' })),
      new HtmlMain(new HtmlH1('Vyacheslav Aristov')),
      new HtmlFooter(['@ ', (new Date).getFullYear(), ' Vyacheslav Aristov']),
    ]
  }
}

export default () => new SiteBody({ node : document.body })
