useEffect(() => {
  if (!user) {
    navigate('/login');
    return;
  }

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/myorders`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Expected JSON but got HTML. Check API_URL or backend route.");
      }

      if (res.ok) {
        setOrders(Array.isArray(data) ? data : []);
      } else {
        if (res.status === 401) {
          logout();
          navigate('/login');
        }
        setOrders([]);
      }
    } catch (error) {
      console.error("Orders Fetch Error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  fetchMyOrders();
}, [user, navigate, logout]);