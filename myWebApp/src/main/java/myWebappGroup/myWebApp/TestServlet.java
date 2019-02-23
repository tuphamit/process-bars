package myWebappGroup.myWebApp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

public class TestServlet extends HttpServlet{

	private final static String USER_AGENT = "Mozilla/5.0";
	private static final String REQUEST_METHOD_GET = "GET";
	private static final String CONTENT_TYPE = "Content-Type";
	private static final String APPLICATION_JSON_CHARSET_UTF_8 = "application/json;charset=UTF-8";
	public static final String HEADER_USER_AGENT = "User-Agent";
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		JSONObject result = new JSONObject(getAPIData());
		resp.getWriter().write(result.toString());
	}
	private static String getAPIData(){
		StringBuffer data = new StringBuffer();
		try {
			URL obj = new URL("http://pb-api.herokuapp.com/bars");
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.setRequestMethod(REQUEST_METHOD_GET);
			con.setRequestProperty(HEADER_USER_AGENT, USER_AGENT);
			con.setRequestProperty(CONTENT_TYPE, APPLICATION_JSON_CHARSET_UTF_8);
			con.setConnectTimeout(3000);
			con.setReadTimeout(3000);
			int responseCode = con.getResponseCode();
			if (responseCode == 200) {
				BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(),"UTF-8"));
				String inputLine;
				while ((inputLine = in.readLine()) != null) {
					data.append(inputLine);
				}
				in.close();
			}
		} catch (Exception e) {
			System.out.println("ERROR GET API DATA");
		}
		return data.toString();
	}
}
